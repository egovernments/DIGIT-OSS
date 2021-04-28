import React from "react";
import PropTypes from "prop-types";
import { List as MaterialUiList, ListItem } from "material-ui/List";

const baseListContainerStyle = { background: "#fff", padding: "0px" };
const baseListItemStyle = { color: "#484848", fontWeight: 500 };

// const nestedItemStyle = {
//   paddingLeft: 0,
//   marginLeft: 0,
// };

const List = ({ listItemContainer, onItemClick, listItemStyle = {}, innerDivStyle, hoverColor, listContainerStyle = {}, items = [], ...rest }) => {
  const renderListItems = (items) => {
    return items.map((item, index) => {
      const { nestedItems } = item;

      if (listItemStyle && Object.keys(listItemStyle).length) {
        item.style = { ...baseListItemStyle, ...listItemStyle, ...item.style };
      }
      if (nestedItems) {
        // recurse over the nested items
        item.nestedItems = renderListItems(nestedItems);
      }

      return (
        <ListItem
          onClick={() => onItemClick && onItemClick(item, index)}
          innerDivStyle={innerDivStyle}
          containerElement={listItemContainer}
          hoverColor={hoverColor}
          key={index}
          {...rest}
          {...item}
        />
      );
    });
  };

  return (
    <div className="list-main-card">
      <MaterialUiList style={{ ...baseListContainerStyle, ...listContainerStyle }}>{renderListItems(items)}</MaterialUiList>
    </div>
  );
};

List.propTypes = {
  listItemContainer: PropTypes.string,
  listItemStyle: PropTypes.object,
  onItemClick: PropTypes.func,
  listContainerStyle: PropTypes.object,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      primaryText: PropTypes.node,
      nestedItems: PropTypes.array,
      secondaryText: PropTypes.node,
      leftIcon: PropTypes.element,
      rightIcon: PropTypes.element,
      leftAvatar: PropTypes.element,
      rightAvatar: PropTypes.element,
      initiallyOpen: PropTypes.bool,
      primaryTogglesNestedList: PropTypes.bool,
      style: PropTypes.object,
    })
  ),
};

export default List;
