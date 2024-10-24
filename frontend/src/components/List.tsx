import React from "react";
import { InfoIcon } from "./Icons";
import Alert from "./Alert";

interface ListProps<T> {
  items?: T[] | [string, T[]][];
  selectKey: (item: T | string) => React.Key;
  render: (item: T | [string, T[]]) => React.ReactElement;
  className?: string;
  classNameItem?: ((item: T | [string, T[]]) => string) | string;
  emptyStateMsg?: string;
}

const List = <T, >({
  items = [],
  selectKey,
  render,
  className = "",
  classNameItem = "",
  emptyStateMsg = "Lista vacia"
}: ListProps<T>): JSX.Element => {

  return (
    <ul className={className}>
 
      {items.length > 0 
        ? items.map((item) => {
          return (
            <li 
              className={typeof classNameItem === 'function' ? classNameItem(item) : classNameItem}
              // key={selectKey(item)}
              key={selectKey(Array.isArray(item) ? item[0] : item)}
            >
              {render(item)}
            </li>
          )
        })
        : (
          <li className="p-4 rounded-md border border-dotted flex gap-x-4 items-center text-neutral-700"> 
            <InfoIcon />
            {emptyStateMsg}
          </li>
        )
      }
    </ul>
  );
};

export default List;
