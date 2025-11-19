import { toast, type ExternalToast } from "sonner";

type ToastType = "default" | "success" | "error" | "info";

interface MessageOptions extends Omit<ExternalToast, "description" | "action"> {
  title: string;
  description?: string;
  actionLabel?: string;
  action?: () => void;
}

class MessageToast {
  private static getToastFn(type: ToastType) {
    switch (type) {
      case "success":
        return toast.success;
      case "error":
        return toast.error;
      case "info":
        return toast.info;
      default:
        return toast;
    }
  }

  static show(type: ToastType, options: MessageOptions) {
    const { title, description, actionLabel, action, ...toastOptions } =
      options;
    const toastFn = MessageToast.getToastFn(type);

    toastFn(title, {
      description,
      action:
        action && actionLabel
          ? { label: actionLabel, onClick: action }
          : undefined,
      ...toastOptions,
    });
  }

  static success(options: MessageOptions) {
    MessageToast.show("success", options);
  }

  static error(options: MessageOptions) {
    MessageToast.show("error", options);
  }

  static info(options: MessageOptions) {
    MessageToast.show("info", options);
  }

  static default(options: MessageOptions) {
    MessageToast.show("default", options);
  }
}

export { MessageToast };
