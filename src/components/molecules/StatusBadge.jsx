import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, className }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "info";
      case "in-progress":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "in-progress":
        return "In Progress";
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
    }
  };

  return (
    <Badge 
      variant={getStatusVariant(status)} 
      className={className}
    >
      {getStatusLabel(status)}
    </Badge>
  );
};

export default StatusBadge;