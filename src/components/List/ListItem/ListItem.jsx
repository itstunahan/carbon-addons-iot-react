import React from 'react';
import { DragSource } from 'react-dnd';
import classnames from 'classnames';
import { Draggable16, ChevronUp16, ChevronDown16 } from '@carbon/icons-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import { DropLocation } from '../../../utils/DragAndDropUtils';
import { settings } from '../../../constants/Settings';

import ListTarget from './ListTarget';

const { iotPrefix, prefix } = settings;

export const ItemType = 'ListItem';

const ListItemWrapper = ({
  id,
  isEditing,
  isSelectable,
  itemWillMove,
  onItemMoved,
  onSelect,
  selected,
  isDragging,
  isLargeRow,
  children,
  connectDragSource,
}) => {
  const body = isSelectable ? (
    <div
      role="button"
      tabIndex={0}
      className={classnames(
        `${iotPrefix}--list-item`,
        `${iotPrefix}--list-item__selectable`,
        { [`${iotPrefix}--list-item__selected`]: selected },
        { [`${iotPrefix}--list-item__large`]: isLargeRow },
        { [`${iotPrefix}--list-item-editable`]: isEditing }
      )}
      onKeyPress={({ key }) => key === 'Enter' && onSelect(id)}
      onClick={() => {
        onSelect(id);
      }}
    >
      {children}
    </div>
  ) : (
    <div
      className={classnames(`${iotPrefix}--list-item`, {
        [`${iotPrefix}--list-item__large`]: isLargeRow,
        [`${iotPrefix}--list-item-editable`]: isEditing,
      })}
    >
      {children}
    </div>
  );

  if (isEditing) {
    return (
      <div
        className={classnames(`${iotPrefix}--list-item-editable--drag-container`, {
          [`${iotPrefix}--list-item-editable-dragging`]: isDragging,
        })}
        ref={instance => {
          if (connectDragSource) {
            connectDragSource(instance);
          }
        }}
      >
        <div
          className={classnames(`${iotPrefix}--list-item-editable--drop-targets`, {
            [`${iotPrefix}--list-item__large`]: isLargeRow,
          })}
        >
          <ListTarget
            id={id}
            targetPosition={DropLocation.Nested}
            itemWillMove={itemWillMove}
            onItemMoved={onItemMoved}
          />
          <ListTarget
            id={id}
            targetPosition={DropLocation.Above}
            itemWillMove={itemWillMove}
            onItemMoved={onItemMoved}
          />
          <ListTarget
            id={id}
            targetPosition={DropLocation.Below}
            itemWillMove={itemWillMove}
            onItemMoved={onItemMoved}
          />
        </div>

        {body}
      </div>
    );
  }

  return body;
};

const ListItemWrapperProps = {
  dragPreviewText: PropTypes.string,
  id: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLargeRow: PropTypes.bool.isRequired,
  isSelectable: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onItemMoved: PropTypes.func.isRequired,
  itemWillMove: PropTypes.func.isRequired,
};

const ListItemPropTypes = {
  id: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  isLargeRow: PropTypes.bool,
  isExpandable: PropTypes.bool,
  onExpand: PropTypes.func,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  expanded: PropTypes.bool,
  value: PropTypes.string.isRequired,
  secondaryValue: PropTypes.string,
  rowActions: PropTypes.arrayOf(PropTypes.node), // TODO
  icon: PropTypes.node,
  iconPosition: PropTypes.string,
  isCategory: PropTypes.bool,
  /** i18n strings */
  i18n: PropTypes.shape({
    expand: PropTypes.string,
    close: PropTypes.string,
  }),
  /** Default selected item ref needed for scrolling */
  selectedItemRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  /** The nodes should be Carbon Tags components */
  tags: PropTypes.arrayOf(PropTypes.node),
  /* these props come from react-dnd */
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  dragPreviewText: PropTypes.string,
  nestedIndex: PropTypes.arrayOf(PropTypes.number),
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  onItemMoved: PropTypes.func.isRequired,
  itemWillMove: PropTypes.func.isRequired,
};

const ListItemDefaultProps = {
  isEditing: false,
  isLargeRow: false,
  isExpandable: false,
  dragHandleText: null,
  onExpand: () => {},
  isSelectable: false,
  onSelect: () => {},
  selected: false,
  expanded: false,
  secondaryValue: null,
  rowActions: [],
  icon: null,
  iconPosition: 'left',
  nestingLevel: [],
  isCategory: false,
  i18n: {
    expand: 'Expand',
    close: 'Close',
  },
  selectedItemRef: null,
  tags: null,
};

const ListItem = ({
  id,
  isEditing,
  isLargeRow,
  isExpandable,
  onExpand,
  expanded,
  isSelectable,
  onSelect,
  selected,
  value,
  secondaryValue,
  rowActions,
  icon,
  iconPosition, // or "right"
  onItemMoved,
  nestingLevel,
  isCategory,
  i18n,
  isDragging,
  isOver,
  selectedItemRef,
  tags,
  connectDragSource,
  connectDragPreview,
  itemWillMove,
  dragPreviewText,
}) => {
  const handleExpansionClick = () => isExpandable && onExpand(id);

  const renderNestingOffset = () =>
    nestingLevel.length > 0 ? (
      <div
        className={`${prefix}--assistive-text ${iotPrefix}--list-item--nesting-offset`}
        style={{ width: `${nestingLevel.length * 30}px` }}
      />
    ) : null;

  const renderExpander = () =>
    isExpandable ? (
      <div
        role="button"
        tabIndex={0}
        className={`${iotPrefix}--list-item--expand-icon`}
        onClick={handleExpansionClick}
        onKeyPress={({ key }) => key === 'Enter' && handleExpansionClick()}
      >
        {expanded ? (
          <ChevronUp16 aria-label={i18n.expand} />
        ) : (
          <ChevronDown16 aria-label={i18n.close} />
        )}
      </div>
    ) : null;

  const renderIcon = () =>
    icon ? (
      <div
        className={`${iotPrefix}--list-item--content--icon ${iotPrefix}--list-item--content--icon__${iconPosition}`}
      >
        {icon}
      </div>
    ) : null;

  const renderRowActions = () =>
    rowActions && rowActions.length > 0 ? (
      <div className={`${iotPrefix}--list-item--content--row-actions`}>{rowActions}</div>
    ) : null;

  const renderTags = () => (tags && tags.length > 0 ? <div>{tags}</div> : null);

  const renderDragPreview = () => {
    if (isEditing && connectDragPreview) {
      return connectDragPreview(
        <div className={`${iotPrefix}--list-item-editable--drag-preview`}>
          {dragPreviewText || value}
        </div>
      );
    }

    return null;
  };

  const dragIcon = () =>
    isEditing ? (
      <Draggable16
        className={classnames(`${iotPrefix}--list-item--handle`)}
        data-testid="list-item-editable"
      />
    ) : null;

  return (
    <ListItemWrapper
      isPreview={false}
      {...{
        id,
        isSelectable,
        isOver,
        selected,
        isDragging,
        isEditing,
        isLargeRow,
        onSelect,
        connectDragSource,
        onItemMoved,
        itemWillMove,
      }}
    >
      {renderDragPreview()}
      {renderNestingOffset()}
      {dragIcon()}
      {renderExpander()}
      <div
        className={classnames(
          `${iotPrefix}--list-item--content`,
          { [`${iotPrefix}--list-item--content__selected`]: selected },
          { [`${iotPrefix}--list-item--content__large`]: isLargeRow }
        )}
        ref={selectedItemRef}
      >
        {renderIcon()}
        <div
          className={classnames(`${iotPrefix}--list-item--content--values`, {
            [`${iotPrefix}--list-item--content--values__large`]: isLargeRow,
          })}
        >
          {isLargeRow ? (
            <>
              <div
                className={`${iotPrefix}--list-item--content--values--main ${iotPrefix}--list-item--content--values--main__large`}
              >
                <div
                  className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                    [`${iotPrefix}--list-item--category`]: isCategory,
                    [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                      rowActions
                    ),
                  })}
                  title={value}
                >
                  {value}
                </div>
                {renderTags()}
                {renderRowActions()}
              </div>
              {secondaryValue ? (
                <div
                  title={secondaryValue}
                  className={classnames(
                    `${iotPrefix}--list-item--content--values--value`,
                    `${iotPrefix}--list-item--content--values--value__large`,
                    {
                      [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                        rowActions
                      ),
                    }
                  )}
                >
                  {secondaryValue}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className={`${iotPrefix}--list-item--content--values--main`}>
                <div
                  className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                    [`${iotPrefix}--list-item--category`]: isCategory,
                    [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                      rowActions
                    ),
                  })}
                  title={value}
                >
                  {value}
                </div>
                {secondaryValue ? (
                  <div
                    title={secondaryValue}
                    className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                      [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                        rowActions
                      ),
                    })}
                  >
                    {secondaryValue}
                  </div>
                ) : null}
                {renderTags()}
                {renderRowActions()}
              </div>
            </>
          )}
        </div>
      </div>
    </ListItemWrapper>
  );
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.columnId,
      props,
      index: props.index,
    };
  },
};

const ds = DragSource(ItemType, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}));

ListItemWrapper.propTypes = ListItemWrapperProps;
ListItem.propTypes = ListItemPropTypes;
ListItem.defaultProps = ListItemDefaultProps;

export { ListItem as UnconnectedListItem };

export default ds(ListItem);
