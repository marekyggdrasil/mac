import { toast } from 'react-toastify';

// https://fkhadra.github.io/react-toastify/how-to-style
function ExampleToast({ closeToast, toastProps }){
  return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error! Task failed successfully.</span>
      <div>
        <button className="btn btn-sm btn-error" onClick={closeToast}>Dismiss</button>
      </div>
    </div>
  );
}

export async function toastInfo(content: string) {
  toast.info(content, {
    theme: "dark"
  })
}

export async function toastWarning(content: string) {
  toast.warn(content, {
    theme: "dark"
  })
}

export async function toastError(content: string) {
  toast.error(content, {
    theme: "dark"
  })
}

export async function toastSuccess(content: string) {
  toast.success(content, {
    theme: "dark"
  })
}
