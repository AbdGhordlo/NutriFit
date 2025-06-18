import { LucideIcon, UtensilsCrossed, Dumbbell, Droplet } from "lucide-react";

export type NotificationType = "meal" | "exercise" | "water";

export interface Notification {
  id: number;
  user_id: number;
  notification_type: NotificationType;
  notification_time: string; // e.g. "08:00"
  created_at: string;
  meal_plan_meal_id?: number | null;
  exercise_plan_exercise_id?: number | null;
  // UI fields
  title: string;
  message: string;
  icon: LucideIcon;
  unread?: boolean;
}

export const notificationTypeMeta: Record<NotificationType, { title: string; message: string; icon: LucideIcon }> = {
  meal: {
    title: "Time to eat!",
    message: "It's time for your next meal",
    icon: UtensilsCrossed,
  },
  exercise: {
    title: "Time to workout!",
    message: "It's time for your next exercise",
    icon: Dumbbell,
  },
  water: {
    title: "Time to hydrate!",
    message: "Don't forget to drink water",
    icon: Droplet,
  },
};

