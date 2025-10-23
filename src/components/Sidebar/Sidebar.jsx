import AppsIcon from "@mui/icons-material/Apps";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Icon } from "@mui/material";

function ListHeader({ title }) {
  return (
    <>
      <div className="list_header_container">
        <div className="list_header">{title}</div>
      </div>
    </>
  );
}
function Sidebar({ selectedRowIndex, setSelectedRowIndex }) {
  return (
    <div className="sidebar">
      <div className="sidebar_items_container">
        {/* <ListItem title="My Games" icon={VideogameAssetIcon} index={0} /> */}
        <ListHeader title="GAMES" />
        <ListItem title="All Games" icon={AppsIcon} index={0} count={true} />
        <ListItem
          title="Favorites"
          icon={FavoriteBorderIcon}
          index={1}
          favorites={true}
        />

        {/* <ListParentItem title="Malene" icon={ChatIcon} index={4}>
          <ListItem isChild={true} title="Child2" icon={ChatIcon} index={5} />
          <ListItem isChild={true} title="Child3" icon={ChatIcon} index={6} />
          <ListItem isChild={true} title="Child4" icon={ChatIcon} index={7} />

        </ListParentItem> */}
      </div>
    </div>
  );
}

export default Sidebar;

function ListItem({ title, icon, count }) {
  return (
    <div className="sidebar_item">
      <div className="list_item_icon">
        <Icon component={icon} />
      </div>
      <div className="list_item_title">{title}</div>
    </div>
  );
}

// function ListParentItem({
//   title,
//   icon,
//   onExpand,
//   onCollapse,
//   index,
//   children,
// }) {
//   const { selectedListItemIndex, setSelectedListItemIndex } =
//     useGlobalContext();
//   const [isExpanded, setIsExpanded] = useState(false);
//   const selected = selectedListItemIndex === index;

//   // Handles clicking the row
//   const handleRowClick = () => {
//     if (!isExpanded) {
//       setIsExpanded(true);
//       onExpand?.(index);
//     }
//     if (!selected) setSelectedListItemIndex(index);
//   };

//   // Handles clicking the collapse arrow only
//   const handleCollapseClick = (e) => {
//     e.stopPropagation(); // Prevent row click
//     const next = !isExpanded;
//     setIsExpanded(next);
//     next ? onExpand?.(index) : onCollapse?.(index);
//   };

//   return (
//     <div className="list_item_parent_container">
//       <div
//         className={`list_item list_item_parent ${selected ? "selected" : ""}`}
//         onClick={handleRowClick}
//         style={{
//           background: selected ? "#2D2D2D" : "#202020",
//           cursor: "pointer",
//         }}
//       >
//         <div className="list_item_icon">
//           <Icon component={icon} />
//         </div>
//         <div className="list_item_title">{title}</div>
//         <div className="flex collapseBtn" onClick={handleCollapseClick}>
//           <ArrowDropDownIcon className={isExpanded ? "rotated" : ""} />
//         </div>
//       </div>
//       {isExpanded && children}
//     </div>
//   );
// }
