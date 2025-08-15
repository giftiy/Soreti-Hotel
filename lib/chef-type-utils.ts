// Utility functions for chef type handling
export function getChefTypeName(chefType: string): string {
  switch (chefType) {
    case "food":
      return "Food Chef"
    case "beverage":
      return "Beverage Chef"
    case "snack":
      return "Snack Chef"
    default:
      return "Chef"
  }
}

export function getChefTypeColor(chefType: string): string {
  switch (chefType) {
    case "food":
      return "text-orange-600"
    case "beverage":
      return "text-blue-600"
    case "snack":
      return "text-purple-600"
    default:
      return "text-gray-600"
  }
}
