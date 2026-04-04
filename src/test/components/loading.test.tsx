import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Loading from "@/app/loading";

describe("Loading", () => {
  it("renders without crashing", () => {
    render(<Loading />);
  });

  it("renders a loading indicator", () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).not.toBeNull();
  });
});
