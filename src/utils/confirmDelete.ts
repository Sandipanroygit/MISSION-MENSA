const DELETE_CONFIRMATION_MESSAGE =
  "Are you sure to delete this item permanently?";

export function confirmPermanentDelete(): boolean {
  return window.confirm(DELETE_CONFIRMATION_MESSAGE);
}

