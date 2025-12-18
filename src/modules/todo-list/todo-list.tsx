import { useQuery, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { todoListApi } from "./api";
import { useState, useRef, useCallback } from 'react';

export function TodoList() {
  const [enabled, setEnabled] = useState(false);

  const { 
    data: todoItems, error,  isLoading, isFetchingNextPage, fetchNextPage, hasNextPage
  } = useInfiniteQuery({
    queryKey: ['tasks', 'list'],
    queryFn: meta => todoListApi.getTodoList({ page: meta.pageParam }, meta),
    enabled: enabled,
    initialPageParam: 1,
    getNextPageParam: (result) => result.next,
    select: result => result.pages.flatMap(page => page.data)
  });

  if (isLoading) {
    return <div>Loading</div>
  }

  if (error) {
    return <div>error: {JSON.stringify(error)}</div>
  }

  const cursorRef = useIntersection(() => {
    fetchNextPage()
  })

  return (
    <div className="p-5 mx-auto max-w-[1200px] mt-10">
      <h1 className="text-3xl font-bold underline mb-5">Allod List</h1>

      <button onClick={() => setEnabled(e => !e)}>
        {!hasNextPage && <div>not load data</div>}
        {isFetchingNextPage && <div>...Loading</div>}
      </button>

      <div className="flex flex-col gap-4">
        {todoItems?.map(todo => (
          <div className="border border-slate-300 rounded p-3"
            key={todo.id}
          >
            {todo.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4" ref={cursorRef}></div>
    </div>
  );
}

export function useIntersection(onIntersect: () => void) {
  const unsubscribe = useRef(() => { })

  return useCallback((el: HTMLDivElement | null) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(intersection => {
        if (intersection.isIntersecting) {
          onIntersect()
        }
      })
    })

    if (el) {
      observer.observe(el);
      unsubscribe.current = () => observer.disconnect()
    } else {
      unsubscribe.current()
    }
  }, [])
}