import React from 'react';

interface SafeContentProps {
  content: string | React.ReactNode;
}

/**
 * SafeContent component that safely renders HTML content without XSS vulnerabilities
 * Replaces the dangerous dangerouslySetInnerHTML approach
 */
export const SafeContent: React.FC<SafeContentProps> = ({ content }) => {
  // If content is already a React node, render it directly
  if (typeof content !== 'string') {
    return <div className="text-foreground leading-relaxed text-base md:text-[17px]">{content}</div>;
  }

  // For string content, we'll parse and safely render common HTML patterns
  // This is a simplified safe HTML renderer that handles the specific patterns used in the education content
  const renderSafeHTML = (htmlString: string) => {
    // Remove script tags and other dangerous elements
    const sanitized = htmlString
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, ''); // Remove event handlers

    // Split content by HTML tags and render safely
    const parts = sanitized.split(/(<[^>]+>)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('<') && part.endsWith('>')) {
        // Handle specific safe HTML tags
        const tagMatch = part.match(/<(\w+)(?:\s[^>]*)?>/);
        const tagName = tagMatch?.[1]?.toLowerCase();
        
        switch (tagName) {
          case 'div':
            return <div key={index} className="mb-4" />;
          case 'p':
            return <p key={index} className="mb-3" />;
          case 'strong':
          case 'b':
            return <strong key={index} />;
          case 'em':
          case 'i':
            return <em key={index} />;
          case 'br':
            return <br key={index} />;
          case 'ul':
            return <ul key={index} className="list-disc pl-5 mb-3" />;
          case 'ol':
            return <ol key={index} className="list-decimal pl-5 mb-3" />;
          case 'li':
            return <li key={index} className="mb-1" />;
          case 'h1':
            return <h1 key={index} className="text-2xl font-bold mb-4" />;
          case 'h2':
            return <h2 key={index} className="text-xl font-bold mb-3" />;
          case 'h3':
            return <h3 key={index} className="text-lg font-semibold mb-2" />;
          default:
            return null; // Ignore unsupported tags
        }
      } else {
        // Regular text content
        return <span key={index}>{part}</span>;
      }
    });
  };

  // For now, we'll use a simpler approach - convert basic HTML to React elements
  // This handles the specific content structure used in the education articles
  const processContent = (htmlString: string) => {
    // Basic HTML to React conversion for the educational content
    return htmlString
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '')
      .replace(/<li>/gi, '• ')
      .replace(/<\/li>/gi, '\n')
      .trim();
  };

  const processedContent = processContent(content);
  
  // Split by double newlines to create paragraphs
  const paragraphs = processedContent.split('\n\n').filter(p => p.trim());
  
  return (
    <div className="text-foreground leading-relaxed text-base md:text-[17px]">
      {paragraphs.map((paragraph, index) => {
        if (paragraph.includes('• ')) {
          // Handle lists
          const items = paragraph.split('\n').filter(item => item.trim().startsWith('• '));
          return (
            <ul key={index} className="list-disc pl-5 mb-4 space-y-1">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{item.replace('• ', '')}</li>
              ))}
            </ul>
          );
        } else {
          // Handle regular paragraphs with bold/italic formatting
          const formatText = (text: string) => {
            const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
            return parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
              } else if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={partIndex}>{part.slice(1, -1)}</em>;
              }
              return part;
            });
          };
          
          return <p key={index} className="mb-4">{formatText(paragraph)}</p>;
        }
      })}
    </div>
  );
};