# Homepage Marquee and Quote Background Design

## Goal

Reduce visual competition in the homepage hero while preserving the acronym marquee as a deliberate transition between the card grid and the tenets, and restore continuous grid treatment behind the Brandeis quote through the footer boundary.

## Scope

This change is limited to the homepage presentation. It does not change marquee behavior, homepage copy, card content, tenet content, routing, data loading, or footer content.

## Structure

- Remove every marquee instance currently rendered inside the hero.
- Remove the standalone bottom marquee entirely.
- Render one acronym marquee immediately after the nine-card layout and immediately before the tenets section.
- Keep the acronym marquee horizontally scrolling using the existing `Marquee` component and accessibility/reduced-motion behavior.

## Visual Treatment

- Increase the relocated acronym marquee's type scale relative to its current hero presentation.
- Give the relocated marquee sufficient vertical spacing to function as a transition without competing with the hero.
- Preserve the existing dark palette, typography, and marquee animation rather than introducing a new visual system.

## Quote-to-Footer Background

- Wrap the Louis Brandeis quote region and the content that follows it through the footer boundary in a dedicated grid-backed section or equivalent container.
- The grid must begin at the top of the quote section and continue without a visible gap through the quote, attribution, closing copy/actions, and to the footer's top edge.
- Keep the grid subtle and ensure quote and footer text retain readable contrast.
- Do not alter quote wording, attribution, footer content, or footer navigation.

## Acceptance Criteria

1. The hero contains no marquee.
2. Exactly one acronym marquee is visible between the nine-card layout and the tenets section.
3. The bottom marquee is absent.
4. The relocated marquee is visibly larger than its prior hero treatment and retains reduced-motion support.
5. The grid background starts at the top of the Brandeis quote region and continues to the top of the footer without interruption.
6. Existing homepage copy, cards, tenets, quote, actions, and footer remain unchanged.
7. The project builds successfully and the homepage renders without console errors.
