import { act } from "react-dom/test-utils";

export function wait(amount = 0) {
  return new Promise((resolve) => setTimeout(resolve, amount));
}

export async function actWait(amount = 0) {
  await act(async () => {
    await wait(amount);
  });
}

export async function updateWrapper(wrapper: any, amount = 0) {
  await act(async () => {
    await wait(amount);
    wrapper.update();
  });
}
