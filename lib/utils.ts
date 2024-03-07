import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "qs";
import { aspectRatioOptions } from "@/constants";
import { error } from "console";

/**
 * Concatenates and merges class names.
 *
 * @param {...ClassValue} inputs - The class values to concatenate.
 * @return {unknown} The merged class names.
 */
export function cn(...inputs: ClassValue[]): unknown {
  return twMerge(clsx(inputs))
}

/**
 * Handles different types of errors and logs them before throwing an appropriate error.
 *
 * @param {unknown} error - the error to be handled
 * @return {void} 
 */
export const handleError = (error: unknown): void => {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

/**
 * Generates an SVG shimmer effect with the specified width and height.
 *
 * @param {number} w - the width of the SVG
 * @param {number} h - the height of the SVG
 * @return {string} the SVG code for the shimmer effect
 */
const shimmer = (w: number, h: number): string => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>
`;

/**
 * Converts the input string to base64 encoding.
 *
 * @param {string} str - The input string to be converted to base64.
 * @return {string} The base64 encoded string.
 */
const toBase64 = (str: string): string =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
    
export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`;

/**
 * Generates a URL query string with the provided parameters and returns the resulting string.
 *
 * @param {FormUrlQueryParams<T>} params - the parameters for generating the URL query string
 * @return {string} the generated URL query string
 */
export const formUrlQuery = <T extends Record<string, string>>(
  params: FormUrlQueryParams<T>
): string => {
  const typedParams = { ...qs.parse(params.searchParams.toString()), [params.key]: params.value };

  return `${window.location.pathname}?${qs.stringify(typedParams as T, { skipNulls: true })}`;
};

interface FormUrlQueryParams<T extends Record<string, string>> {
  searchParams: URLSearchParams;
  key: keyof T;
  value: T[keyof T];
}

/**
 * Removes specified keys from the query parameters and returns the updated URL string.
 *
 * @param {RemoveUrlQueryParams<T>} params - The parameters object containing the searchParams and keysToRemove
 * @return {string} The updated URL string with specified keys removed
 */
export function removeKeysFromQuery<T extends Record<string, string>>(params: RemoveUrlQueryParams<T>): string {
  const currentUrl = qs.parse(params.searchParams.toString()) as T;

  params.keysToRemove.forEach((key: keyof T) => {
    delete currentUrl[key];
  });

  Object.keys(currentUrl).forEach(
    (key) => currentUrl[key] == null && delete currentUrl[key]
  );

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

interface RemoveUrlQueryParams<T extends Record<string, string>> {
  searchParams: URLSearchParams;
  keysToRemove: Array<keyof T>;
}

/**
 * Debounces a function, ensuring it's not called again until a certain amount of time has passed.
 *
 * @param {Function} func - The function to be debounced.
 * @param {number} delay - The delay in milliseconds.
 * @return {Function} The debounced function.
 */
export const debounce = (func: (...args: any[]) => void, delay: number): Function => {
  let timeoutId: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeoutId) clearInterval(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export type AspectRatioKey = keyof typeof aspectRatioOptions;
/**
 * Returns the size of the specified dimension for the given image based on the type.
 *
 * @param {string} type - The type of the image.
 * @param {any} image - The image object.
 * @param {"width" | "height"} dimension - The dimension to retrieve the size for.
 * @return {number} The size of the specified dimension for the given image.
 */
export const getImageSize = (
  type: string,
  image: any,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return (
      aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
      1000
    );
  }
  return image?.[dimension] || 1000;
};

/**
 * Download a file from the given URL and save it with the specified filename.
 *
 * @param {string} url - the URL of the resource to download
 * @param {string} filename - the name of the file to save
 * @return {void} 
 */
export const download = (url: string, filename: string): void => {
  if (!url) {
    throw new Error("Resource url not provided! Please provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length)
        a.download = `${filename.replace(" ", "_")}.png`;
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
};

/**
 * Merge two objects deeply, prioritizing the second object's properties over the first object's properties.
 *
 * @param {any} obj1 - The first object to merge
 * @param {any} obj2 - The second object to merge
 * @return {any} The merged object
 */
export const deepMergeObjects = (obj1: any, obj2: any): any => {
  if(obj2 === null || obj2 === undefined) {
    return obj1;
  }

  let output = { ...obj2 };

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};