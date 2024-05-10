import React from "react";

interface ListProps<T> {
  items?: T[] | [string, T[]][];
  selectKey: (item: T | [string, T[]]) => React.Key;
  render: (item: T | [string, T[]]) => React.ReactElement;
  className?: string;
  classNameItem?: ((item: T | [string, T[]]) => string) | string;
  emptyStateMsg?: string;
}

// function isObjectLiteral(obj: unknown) {
//   return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && obj.constructor === Object;
// }

const List = <T, >({
  items = [],
  selectKey,
  render,
  className = "",
  classNameItem = "",
  emptyStateMsg = "Lista vacia"
}: ListProps<T>): JSX.Element => {

  // const finalItems = isObjectLiteral(items) ? Object.entries(items) : items
  // console.log({ finalItems });

  return (
    <ul className={className}>
 
      {items.length > 0 
        ? items.map((item) => {
          return (
            <li 
              className={typeof classNameItem === 'function' ? classNameItem(item) : classNameItem}
              key={selectKey(item)}
            >
              {render(item)}
            </li>
          )
        })
        : (
          <li className="p-4 rounded-md"> 
            <span className="px-2"> ℹ </span>
            {emptyStateMsg}
          </li>
        )
      }
    </ul>
  );
};

export default List;
