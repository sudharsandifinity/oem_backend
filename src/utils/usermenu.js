const { encodeId } = require("./hashids");

function usermenu(flatMenus) {
  const menuMap = {};
  const roots = [];

  flatMenus.forEach(rawMenu => {
    const menu = typeof rawMenu.toJSON === 'function' ? rawMenu.toJSON() : rawMenu;
    menu.children = [];
    menuMap[menu.id] = menu;
  });

  flatMenus.forEach(rawMenu => {
    const menu = typeof rawMenu.toJSON === 'function' ? rawMenu.toJSON() : rawMenu;
    const parentId = menu.parentUserMenuId;
    if (parentId && menuMap[parentId]) {
      menuMap[parentId].children.push(menuMap[menu.id]);
    } else {
      roots.push(menuMap[menu.id]);
    }
  });

  return roots;
}


function encodeUserMenu(menuItem) {
  menuItem.id = encodeId(menuItem.id);
  menuItem.parentUserMenuId = encodeId(menuItem.parentUserMenuId);
  menuItem.companyId = encodeId(menuItem.companyId);
  menuItem.branchId = encodeId(menuItem.branchId);
  menuItem.formId = encodeId(menuItem.formId);

  if (menuItem.Form) {
    menuItem.Form.id = encodeId(menuItem.Form.id);
    menuItem.Form.parentFormId = encodeId(menuItem.Form.parentFormId);
    menuItem.Form.companyId = encodeId(menuItem.Form.companyId);
    menuItem.Form.branchId = encodeId(menuItem.Form.branchId);

    if (Array.isArray(menuItem.Form.FormFields)) {
      menuItem.Form.FormFields = menuItem.Form.FormFields.map(field => ({
        ...field,
        id: encodeId(field.id),
        formId: encodeId(field.formId),
        formSectionId: encodeId(field.formSectionId),
      }));
    }
  }

  if (Array.isArray(menuItem.children)) {
    menuItem.children = menuItem.children.map(child => encodeUserMenu(child));
  }

  return menuItem;
}

module.exports = {
  usermenu, encodeUserMenu
};
