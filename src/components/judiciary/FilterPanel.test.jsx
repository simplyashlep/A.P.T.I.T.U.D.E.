// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import FilterPanel from "./FilterPanel";

afterEach(() => cleanup());

const makeProps = (over = {}) => ({
  open: true,
  onClose: vi.fn(),
  triggerRef: { current: null },
  filters: { q: "", county: "", risk: "", court: "", caseTypes: [] },
  onChange: vi.fn(),
  resultCount: 211,
  counties: ["Multnomah", "Clackamas"],
  courts: ["Circuit Court", "COA"],
  ...over,
});

describe("FilterPanel", () => {
  it("renders the dialog with an accessible name", () => {
    render(<FilterPanel {...makeProps()} />);
    expect(screen.getByRole("dialog", { name: /filter judges/i })).toBeInTheDocument();
  });

  it("toggles a case-type chip and calls onChange with the new selection", () => {
    const onChange = vi.fn();
    render(<FilterPanel {...makeProps({ onChange })} />);
    fireEvent.click(screen.getByTestId("case-type-criminal"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ caseTypes: ["Criminal"] }));
  });

  it("shows the live result count", () => {
    render(<FilterPanel {...makeProps({ resultCount: 12 })} />);
    expect(screen.getByText(/12 judges matched/i)).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const onClose = vi.fn();
    const triggerRef = { current: document.createElement("button") };
    document.body.appendChild(triggerRef.current);
    triggerRef.current.focus();
    render(<FilterPanel {...makeProps({ onClose, triggerRef })} />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
    expect(document.activeElement).toBe(triggerRef.current);
  });

  it("calls clear-all with empty filters", () => {
    const onChange = vi.fn();
    render(<FilterPanel {...makeProps({ onChange })} />);
    fireEvent.click(screen.getByTestId("filter-clear-all"));
    expect(onChange).toHaveBeenCalledWith({ q: "", county: "", risk: "", court: "", caseTypes: [] });
  });
});
