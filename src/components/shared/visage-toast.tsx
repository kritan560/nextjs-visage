import vtoast from "react-hot-toast";

class VisageToastHandler {
  // Method to handle success messages
  success(message?: string) {
    vtoast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } h-fit w-fit rounded-full bg-white px-6 py-3 text-stone-800 dark:bg-stone-800 dark:text-white`}
      >
        ✅ {message}
      </div>
    ));
  }

  // Method to handle error messages
  error(message?: string) {
    vtoast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } h-fit w-fit rounded-full bg-rose-500 px-6 py-3 text-white dark:bg-rose-700`}
      >
        ❌ {message}
      </div>
    ));
  }
}

// Create an instance of the VisageToastHandler class
export const VisageToast = new VisageToastHandler();
