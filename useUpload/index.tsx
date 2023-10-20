import {Reducer, useMemo, useReducer} from "react";

interface useUploadOption {
  action: string
}

interface UploadHelpers {
  allDone: boolean,
  addFile: () => void,
  removeFile: (index: number) => void,
}

interface fileOption {
  done: boolean,
  fileName: string,
  fileUuid: string,
  fileSize: string,
}

interface listOption {
  controller: AbortController,
  file: fileOption,
}


const useUpload = ({action}: useUploadOption): [fileOption[], UploadHelpers] => {
  const [list, setList] = useReducer<Reducer<listOption[], listOption | number>>((oldList, value) => {
    const newList = [...oldList]
    if (typeof value === 'number') {
      newList.splice(value);
    } else {
      const {file} = value;
      if (!file.done) {
        newList.push(value)
      } else {
        const index = newList.map(i => i.file.fileName).indexOf(file.fileName)
        if (index > -1) {
          newList[index] = value;
        }
      }
    }

    return newList;
  }, []);

  const fileList = useMemo(() => list.map(i => i.file), [list])
  const allDone = useMemo(() => list.every(i => i.file.done), [list])


  const upload = async () => {
    var fileInput = document.getElementById('fileInput') as HTMLInputElement;
    var files = fileInput.files;
    console.log(files)
    if (!files) {
      console.log('请先上传文件')
      return
    }
    if (!files.length) {
      return
    }
    var fileName = files[0].name;


    var formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', files[0]);

    // XMLHttpRequest实现方法
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', action);
    // xhr.send(formData);
    // xhr.onload = function() {
    //   console.log('上传完成')
    // }
    const controller = new AbortController();
    setList({
      controller,
      file: {
        done: false,
        fileName: fileName,
        fileUuid: '',
        fileSize: '',
      }
    })
    const response = await fetch(action, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })


    const json = await response.json()

    if (json.flag === "SUCCESS") {
      const {fileName, fileUuid, fileSize} = json.data[0];
      setList({
        controller,
        file: {
          done: true,
          fileName,
          fileUuid,
          fileSize,
        }
      })
    }
  }

  const addFile = async () => {
    const node = document.createElement('input');
    node.setAttribute('type', 'file')
    node.setAttribute('id', 'fileInput')
    node.setAttribute('multiple', 'true')
    node.setAttribute('style', 'display:none')
    node.onchange = () => {
      upload()
    }
    let fileInput = document.getElementById('fileInput');
    if (!fileInput) {
      if (document.body.append) {
        document.body.append(node);
      } else if (document.body.appendChild) {
        document.body.appendChild(node);
      }
      fileInput = document.getElementById('fileInput');
    }

    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    fileInput?.dispatchEvent(event);
  }

  const removeFile = (index: number) => {
    list[index].controller.abort()
    setList(index)
  }

  return [
    fileList,
    {
      allDone,
      addFile,
      removeFile,
    }
  ]
}
export default useUpload;
