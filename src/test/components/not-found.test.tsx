import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("renders without crashing", () => {
    render(<NotFound />);
  });

  it("contains a link back to home", () => {
    render(<NotFound />);
    const links = screen.getAllByRole("link");
    const homeLink = links.find(
      (link) => link.getAttribute("href") === "/" || link.textContent?.toLowerCase().includes("home")
    );
    expect(homeLink).toBeTruthy();
  });
});
