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


function encodeUserMenu(menu) {
    if (menu.id) menu.id = encodeId(menu.id);
    if (menu.parentUserMenuId) menu.parentUserMenuId = encodeId(menu.parentUserMenuId);
    if (menu.companyId) menu.companyId = encodeId(menu.companyId);
    if (menu.branchId) menu.branchId = encodeId(menu.branchId);
    if (menu.formId) menu.formId = encodeId(menu.formId);

    if (menu.Form) {
        if (menu.Form.id) menu.Form.id = encodeId(menu.Form.id);
        if (menu.Form.parentFormId) menu.Form.parentFormId = encodeId(menu.Form.parentFormId);
        if (menu.Form.companyId) menu.Form.companyId = encodeId(menu.Form.companyId);
        if (menu.Form.branchId) menu.Form.branchId = encodeId(menu.Form.branchId);

        if (Array.isArray(menu.Form.FormTabs)) {
            menu.Form.FormTabs.forEach(tab => {
                tab.id = encodeId(tab.id);
                if (tab.formId) tab.formId = encodeId(tab.formId);

                if (Array.isArray(tab.SubForms)) {
                    tab.SubForms.forEach(subForm => {
                        subForm.id = encodeId(subForm.id);
                        if (subForm.formTabId) subForm.formTabId = encodeId(subForm.formTabId);

                        if (Array.isArray(subForm.FormFields)) {
                            subForm.FormFields.forEach(field => {
                                field.id = encodeId(field.id);
                                if (field.subFormId) field.subFormId = encodeId(field.subFormId);
                                if (field.formSectionId) field.formSectionId = encodeId(field.formSectionId);
                            });
                        }
                    });
                }
            });
        }
    }
    if (Array.isArray(menu.children)) {
        menu.children.forEach(child => encodeUserMenu(child));
    }
}

module.exports = {
  usermenu, encodeUserMenu
};
