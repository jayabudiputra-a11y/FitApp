// src/components/FormattedDate.tsx
import { format } from 'date-fns';
import { enUS, type Locale } from 'date-fns/locale'; // ✅ Perbaikan import

interface FormattedDateProps {
  dateString: string | Date | number | null | undefined;
  formatString?: string;
  locale?: Locale;
  fallback?: string;
  className?: string;
  variant?: 'default' | 'card' | 'detail' | 'meta';
}

const FormattedDate: React.FC<FormattedDateProps> = ({ 
  dateString, 
  formatString = "MMMM d, yyyy", // Default: "November 26, 2025"
  locale = enUS,
  fallback = "Date not available",
  className = "",
  variant = "default"
}) => {
  // Handle null/undefined
  if (!dateString) {
    return <span className={className}>{fallback}</span>;
  }

  try {
    let date: Date;
    
    // Handle different input types
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      // Handle ISO format with timezone (your database format)
      if (dateString.includes('T') || dateString.includes('+') || dateString.includes('Z')) {
        date = new Date(dateString);
      } else {
        // Handle other string formats
        date = new Date(dateString);
      }
    } else if (typeof dateString === 'number') {
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }

    // Validate date
    if (isNaN(date.getTime())) {
      console.error('❌ Invalid date:', dateString);
      return <span className={className}>{fallback}</span>;
    }

    // Format the date
    const formattedDate = format(date, formatString, { locale });
    
    // Debug log (remove in production)
    if (import.meta.env.DEV) {
      console.log('📅 Date Debug:', {
        input: dateString,
        parsed: date,
        formatted: formattedDate,
        variant
      });
    }
    
    // Apply variant-specific classes
    const variantClasses = {
      default: "",
      card: "text-emerald-600 font-medium",
      detail: "text-gray-700",
      meta: "text-gray-500"
    };
    
    const finalClassName = `${variantClasses[variant]} ${className}`.trim();
    
    return <span className={finalClassName}>{formattedDate}</span>;
  } catch (error) {
    console.error('❌ Date formatting error:', error, 'for date:', dateString);
    return <span className={className}>{fallback}</span>;
  }
};

export default FormattedDate;