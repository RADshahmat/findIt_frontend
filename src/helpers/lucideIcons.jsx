// utils/lucideIcons.js
import * as Icons from "lucide-react";

export function getLucideIcon(name) {
  return Icons[name] || Icons.FolderOpen; // fallback icon
}
