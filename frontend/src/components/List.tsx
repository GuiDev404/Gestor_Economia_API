import React from "react";

interface ListProps<T> {
  items?: T[];
  selectKey: (item: T) => React.Key;
  render: (item: T) => React.ReactElement;
  className?: string;
  classNameItem?: ((item: T) => string) | string;
  emptyStateMsg?: string;
}

const List = <T,>({
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
        ? items.map((item) => (
            <li className={typeof classNameItem === 'function' ? classNameItem(item) : classNameItem} key={selectKey(item)}>
              {render(item)}
            </li>
          ))
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
