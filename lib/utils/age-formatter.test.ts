import { describe, it, expect } from "vitest";
import { formatAge } from "./age-formatter";

describe("Age Formatter Utility", () => {
  it("should format only years correctly (singular)", () => {
    expect(formatAge(1, 0)).toBe("1 año");
    expect(formatAge(1, null)).toBe("1 año");
  });

  it("should format only years correctly (plural)", () => {
    expect(formatAge(2, 0)).toBe("2 años");
    expect(formatAge(5, undefined)).toBe("5 años");
  });

  it("should format only months correctly (singular)", () => {
    expect(formatAge(0, 1)).toBe("1 mes");
    expect(formatAge(null, 1)).toBe("1 mes");
  });

  it("should format only months correctly (plural)", () => {
    expect(formatAge(0, 6)).toBe("6 meses");
    expect(formatAge(undefined, 11)).toBe("11 meses");
  });

  it("should format both years and months correctly", () => {
    expect(formatAge(1, 1)).toBe("1 año y 1 mes");
    expect(formatAge(2, 5)).toBe("2 años y 5 meses");
    expect(formatAge(10, 11)).toBe("10 años y 11 meses");
  });

  it("should handle newborn/zero case", () => {
    expect(formatAge(0, 0)).toBe("Recién nacido");
  });

  it("should handle unknown/null cases", () => {
    expect(formatAge(null, null)).toBe("Edad desconocida");
    expect(formatAge(undefined, undefined)).toBe("Edad desconocida");
  });
});
