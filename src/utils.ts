export function statusColorFn(status: string) {
  let color;

  switch (status) {
    case "paid":
      color = "text-emerald-500 bg-emerald-500/20";
      break;
    case "draft":
      color = "text-gray-500 bg-gray-500/20";
      break;
    case "due":
    case "overdue":
      color = "text-red-500 bg-red-500/20";
      break;
    default:
      color = "text-orange-400 bg-orange-400/20";
  }

  return color;
}
