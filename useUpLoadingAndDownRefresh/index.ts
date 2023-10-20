import React, {DependencyList, useEffect, useMemo, useRef, useState} from "react";

interface useUpLoadingAndDownRefreshProps {
  ref: React.MutableRefObject<HTMLElement | null>,
  onLoadData: (index: number) => Promise<any> | undefined,
}

enum RefreshStateEnum {
  'INIT' = 'INIT',
  'LOAD' = 'LOAD',
  'READY' = 'READY',
  'LOADING' = 'LOADING',
  'SUCCESS' = 'SUCCESS',
  'FAIL' = 'FAIL',
}

enum LoadStateEnum {
  'READY' = 'READY',
  'LOADING' = 'LOADING',
  'NOTLOADING' = 'NOTLOADING',
}

enum RefreshTextEnum {
  'LOAD' = '下拉刷新',
  'READY' = '释放立即刷新',
  'LOADING' = '加载中...',
  'SUCCESS' = '刷新成功',
  'FAIL' = '刷新失败',
}

enum LoadTextEnum {
  'NOTLOADING' = '没有更多了',
  'LOADING' = '加载中...',
}

const useUpLoadingAndDownRefresh = (
  {
    ref,
    onLoadData,
  }: useUpLoadingAndDownRefreshProps,
  deps?: DependencyList) => {
  // onMouseDown
  // onMouseMove
  // onMouseUp
  // onTouchStart
  // onTouchMove
  // onTouchEnd
  const [refreshState, setRefreshState] = useState(RefreshStateEnum.LOAD)
  const [loadState, setLoadState] = useState(LoadStateEnum.READY)

  const [list, setList] = useState<any[]>([]);

  const ref1 = useRef(document.createElement("div"))//刷新
  const ref2 = useRef(document.createElement("div"))//加载


  const ref3 = useRef(document.createElement("div"))//刷新div

  useEffect(() => {
    handRefresh();
  }, deps)

  useEffect(() => {
    refresh.init();
    load.init();
  }, [])

  const handRefresh = () => {
    onLoadData(1)?.then((res) => {
      if (res.flag === 'SUCCESS') {
        setIndex(res.pageIndex)
        setTotalIndex(res.totalPageCount)
        setList(res.datas)
        const parentNode = ref.current?.parentNode as HTMLElement | null;
        parentNode?.scrollTo({top: 0, behavior: "smooth"})
      } else if (res.flag === 'Fail') {
      }
    })
  }


  const [startPageY, setStartPageY] = useState(0)
  const [movePageY, setMovePageY] = useState(0)
  const [bool, setBool] = useState(false)

  const distance = useMemo(() => {
    return (movePageY - startPageY) * (1 / 3);
  }, [startPageY, movePageY])

  const [offsetHeight, setOffsetHeight] = useState<number>(0)
  const [scrollTop, setScrollTop] = useState<number>(0)
  const [scrollHeight, setScrollHeight] = useState<number>(0)
  const loading = useMemo(() => {
    return Math.round(offsetHeight + scrollTop) + 3 >= scrollHeight;
  }, [offsetHeight, scrollTop, scrollHeight])

  const [index, setIndex] = useState(0);
  const [totalIndex, setTotalIndex] = useState(0);

  useEffect(() => {
    switch (refreshState) {
      case RefreshStateEnum.LOAD:
        refresh.text(RefreshTextEnum.LOAD)
        refresh.click()
        break
      case RefreshStateEnum.LOADING:
        refresh.text(RefreshTextEnum.LOADING)
        onLoadData(1)?.then((res) => {
          if (res.flag === 'SUCCESS') {
            setIndex(res.pageIndex)
            setTotalIndex(res.totalPageCount)
            setList(res.datas)
            setRefreshState(RefreshStateEnum.SUCCESS)
            refresh.text(RefreshTextEnum.SUCCESS)
          } else if (res.flag === 'Fail') {
            setRefreshState(RefreshStateEnum.FAIL)
            refresh.text(RefreshTextEnum.FAIL)
          }
        })
        break
      case RefreshStateEnum.READY:
        refresh.text(RefreshTextEnum.READY)
        break
      case RefreshStateEnum.SUCCESS:
      case RefreshStateEnum.FAIL:
      case RefreshStateEnum.INIT:
        refresh.callBack();
    }
  }, [refreshState])

  useEffect(() => {
    switch (loadState) {
      case LoadStateEnum.LOADING:
        load.text(LoadTextEnum.LOADING)
        onLoadData(index + 1)?.then((res) => {
          if (res.flag === 'SUCCESS') {
            setIndex(res.pageIndex)
            setTotalIndex(res.totalPageCount)
            setList(oldList => ([...oldList, ...res.datas]))
          } else if (res.flag === 'Fail') {
          }
        })
        break
      case LoadStateEnum.NOTLOADING:
        load.text(LoadTextEnum.NOTLOADING)
        break
    }
  }, [loadState])


  useEffect(() => {

    if (bool) {
      refresh.update(distance)
      setRefreshState(RefreshStateEnum.LOAD)
      if (distance >= 40) {
        setRefreshState(RefreshStateEnum.READY)
      }
    } else {
      if (refreshState === RefreshStateEnum.READY) {
        setRefreshState(RefreshStateEnum.LOADING)
      } else {
        setRefreshState(RefreshStateEnum.INIT)
      }
    }
  }, [distance, bool])

  useEffect(() => {
    if (loading) {
      if (loadState === LoadStateEnum.READY) {
        if (index < totalIndex) {
          setLoadState(LoadStateEnum.LOADING)
        } else {
          setLoadState(LoadStateEnum.NOTLOADING)
        }
      }
    } else {
      setLoadState(LoadStateEnum.READY)
    }

  }, [index, totalIndex, loading, loadState])


  const refresh = useMemo(() => ({
    init: () => {
      if (!ref.current) return;
      refresh.text(RefreshTextEnum.LOAD)
      ref3.current.style.height = '40px'
      ref3.current.style.display = 'flex';
      ref3.current.style.alignItems = 'center';
      ref3.current.style.justifyContent = 'center';
      ref1.current.style.overflow = 'hidden'
      ref1.current.style.transition = 'height 0s';
      ref1.current.appendChild(ref3.current);
      const parentNode = ref.current.parentNode as HTMLElement | null;
      parentNode?.insertBefore(ref1.current, parentNode.childNodes[0])
    },
    update: (distance: number) => {
      ref1.current.style.height = `${distance}px`;
    },
    click: () => {
      ref1.current.style.transition = 'height 0s';
    },
    callBack: () => {
      ref1.current.style.transition = 'height .3s';
      refresh.update(0);
    },
    text: (text: string) => {
      ref3.current.innerText = text
    },
  }), [])

  const load = useMemo(() => ({
    init: () => {
      if (!ref.current) return;
      load.text(LoadTextEnum.LOADING)
      ref2.current.style.height = '40px'
      ref2.current.style.display = 'flex';
      ref2.current.style.alignItems = 'center';
      ref2.current.style.justifyContent = 'center';
      const parentNode = ref.current.parentNode as HTMLElement | null;
      parentNode?.appendChild(ref2.current)
    },
    text: (text: string) => {
      ref2.current.innerText = text
    },
  }), [])

  const event = useMemo(() => ({
    onTouchStart: (e: TouchEvent) => {
      if (!ref.current) return;
      const parentNode = ref.current.parentNode as HTMLElement | null;
      if (!parentNode) return;
      if (parentNode.scrollTop > 0) {
        return
      }
      setStartPageY(e.touches[0].pageY)
      setMovePageY(e.touches[0].pageY)
      setBool(true)
    },
    onTouchMove: (e: TouchEvent) => {
      if (!ref.current) return;
      const parentNode = ref.current.parentNode as HTMLElement | null;
      if (!parentNode) return;
      if (parentNode.scrollTop > 0) {
        return
      }
      setMovePageY(e.touches[0].pageY)
    },
    onTouchEnd: (e: TouchEvent) => {
      setBool(false)
    },
    onScroll: () => {
      if (!ref.current) return;
      const parentNode = ref.current.parentNode as HTMLElement | null;
      if (!parentNode) return;
      setOffsetHeight(parentNode.offsetHeight)
      setScrollTop(parentNode.scrollTop)
      setScrollHeight(parentNode.scrollHeight)
    },
  }), [loadState])


  useEffect(() => {
    if (!ref.current) return;
    ref.current.ontouchstart = event.onTouchStart;
    ref.current.ontouchmove = event.onTouchMove;
    ref.current.ontouchend = event.onTouchEnd;

    const parentNode = ref.current.parentNode as HTMLElement | null;
    if (!parentNode) return;
    parentNode.onscroll = event.onScroll;

  }, [])


  //
  // ref.current.addEventListener('mouseDown',function () {
  //   console.log(
  //     1
  //   )
  // })
  // ref.current.addEventListener('mousemove',function () {
  //   console.log(
  //     2
  //   )
  // })
  // ref.current.addEventListener('mouseUp',function () {
  //   console.log(
  //     3
  //   )
  // })


  return [list, handRefresh]
}
export default useUpLoadingAndDownRefresh;
