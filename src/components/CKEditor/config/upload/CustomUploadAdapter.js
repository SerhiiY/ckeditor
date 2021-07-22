import api from 'api';

class CustomUploadAdapter {
  constructor(loader) {
    // CKEditor 5's FileLoader instance.
    this.loader = loader;

    // URL where to send files.
    const projectId = String(window.location).match(/projects\/[0-9]+/)[0].match(/[0-9]+/)[0];
    this.url = `/api/v2/projects/${projectId}/images`;
  }

  // Starts the upload process.
  upload() {
    return new Promise((resolve, reject) => {
      this._initRequest(resolve, reject);
    });
  }

  async _initRequest(resolve, reject) {
    const loader = this.loader;
    let genericErrorText = '';

    try {
      const file = await loader.file;

      const fileName = file.name.length > 30 ? `${file.name.slice(0, 30)}...` : file.name;
      genericErrorText = `Couldn't upload file ${fileName || ''}:`;
      
      const formData = new FormData(); // request params
      formData.append("source", "local");
      formData.append("sourceValue", file.name);
      formData.append("file", file, file.name);

      const res = await api.post(this.url, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: ({loaded, total}) => {
          loader.uploadTotal = total;
          loader.uploaded = loaded;
        }
      })
  
      const {error, data} = res.data;

      if(error) return reject(`${genericErrorText} ${error.message}`);

      const url = `${window.location.origin}${data.imageUrl}`;
      resolve({default: url})
    }
    catch (error) {
      reject(`${genericErrorText} ${error.message}`);
    }
  }
}

export default function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader);
  };
};
