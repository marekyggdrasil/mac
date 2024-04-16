import { toast } from "react-toastify";

export async function toastInfo(content: string) {
  toast.info(content, {
    theme: "dark",
  });
}

export async function toastWarning(content: string) {
  toast.warn(content, {
    theme: "dark",
  });
}

export async function toastError(content: string) {
  toast.error(content, {
    theme: "dark",
  });
}

export async function toastSuccess(content: string) {
  toast.success(content, {
    theme: "dark",
  });
}
