import {
  FieldValueStaticFilter,
  StaticFilter,
} from "@yext/search-headless-react";
import { ParentCategory } from "./types/beverage_categories";
import { CategoryLink } from "./types/kg";

// TODO: modify to account for facets and filters
export const setPathAndQueryParams = (
  name: string,
  value: any,
  path?: string
) => {
  const pathname = window.location.pathname;
  const queryParams = new URLSearchParams(window.location.search);

  queryParams.set("query", value);

  if (pathname.includes("/search")) {
    history.pushState(null, "", `${path ?? ""}?` + queryParams.toString());
  } else {
    window.location.href = `/search?query=${value}`;
  }
};

export const removeQueryParam = (name: string) => {
  const queryParams = new URLSearchParams(window.location.search);
  // Set new or modify existing parameter value.
  queryParams.delete(name);
  // OR do a push to history
  history.pushState(null, "", "?" + queryParams.toString());
};

export const flattenCategoryAncestors = (
  parentCategory: ParentCategory
): CategoryLink[] => {
  if (!parentCategory) [];

  const links = [{ name: parentCategory.name, slug: parentCategory.slug }];
  if (parentCategory.c_parentCategory?.[0]) {
    return links.concat(
      flattenCategoryAncestors(parentCategory.c_parentCategory[0])
    );
  }
  return links;
};

export const flattenCategories = (
  categories: ParentCategory[]
): CategoryLink[] => {
  const links: CategoryLink[] = [];
  categories.forEach((category) => {
    if (category.c_parentCategory?.[0]) {
      const parentIndex = links
        .map((link) => link.name)
        .indexOf(category.c_parentCategory?.[0].name);
      if (parentIndex === -1) {
        links.push({ name: category.name, slug: category.slug });
      } else {
        links.splice(parentIndex + 1, 0, {
          name: category.name,
          slug: category.slug,
        });
      }
    } else {
      links.unshift({ name: category.name, slug: category.slug });
    }
  });
  return links;
};

export const deepEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (a == null || typeof a != "object" || b == null || typeof b != "object")
    return false;
  const keysA = Object.keys(a),
    keysB = Object.keys(b);
  if (keysA.length != keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
};

export const getFieldValueFilters = (
  staticFilters: StaticFilter[]
): FieldValueStaticFilter[] => {
  const newFilters = staticFilters.reduce(
    (fieldValueFilters: FieldValueStaticFilter[], filter) => {
      if (filter.kind === "fieldValue") {
        fieldValueFilters.push(filter);
      }
      return fieldValueFilters;
    },
    []
  );
  return newFilters;
};
