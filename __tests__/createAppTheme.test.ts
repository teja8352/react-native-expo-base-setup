/// <reference types="jest" />

import { createAppTheme } from "theme/createAppTheme";

describe("createAppTheme", () => {
  it("creates light and dark themes with consistent token keys", () => {
    const light = createAppTheme("light");
    const dark = createAppTheme("dark");
    expect(light.mode).toBe("light");
    expect(dark.mode).toBe("dark");
    expect(light.colors.textPrimary).not.toBe(dark.colors.textPrimary);
  });
});
