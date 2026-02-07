/**
 * Utility functions for React node type guards and extraction
 */

type ReactElementWithProps = React.ReactElement & {
  props?: {
    children?: React.ReactNode;
    [key: string]: unknown;
  };
};

/**
 * Safely extract text content from React nodes
 * Handles strings, numbers, arrays, and React elements recursively
 */
export function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join('');
  
  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as ReactElementWithProps;
    return getTextContent(element.props?.children);
  }
  
  return '';
}

/**
 * Check if a React element is of a specific type
 */
export function isElementType(node: React.ReactNode, type: string): boolean {
  return (
    node !== null &&
    typeof node === 'object' &&
    'type' in node &&
    (node as React.ReactElement).type === type
  );
}

/**
 * Extract code content from a pre element's children
 * Specifically looks for nested code elements
 */
export function extractCodeFromPre(node: React.ReactNode): string {
  const text = getTextContent(node);
  
  // If node is a code element, we want to extract just its text
  if (isElementType(node, 'code')) {
    return text;
  }
  
  return text;
}
