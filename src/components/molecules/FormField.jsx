import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false, 
  className,
  options = [],
  children,
  ...props 
}) => {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <Select error={!!error} {...props}>
            {children || (
              <>
                <option value="">Select an option</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </>
            )}
          </Select>
        );
      case "textarea":
        return <Textarea error={!!error} {...props} />;
      default:
        return <Input type={type} error={!!error} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;