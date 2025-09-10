'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      {
        name: 'user_list',
        module: 'users',
        http_method: 'GET',
        route: '/api/v1/admin/users',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_get',
        module: 'users',
        http_method: 'GET',
        route: '/api/v1/admin/users/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_create',
        module: 'users',
        http_method: 'POST',
        route: '/api/v1/admin/users',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_update',
        module: 'users',
        http_method: 'PUT',
        route: '/api/v1/admin/users/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_delete',
        module: 'users',
        http_method: 'DELETE',
        route: '/api/v1/admin/users/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'role_list',
        module: 'roles',
        http_method: 'GET',
        route: '/api/v1/admin/roles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'role_get',
        module: 'roles',
        http_method: 'GET',
        route: '/api/v1/admin/roles/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'role_create',
        module: 'roles',
        http_method: 'POST',
        route: '/api/v1/admin/roles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'role_update',
        module: 'roles',
        http_method: 'PUT',
        route: '/api/v1/admin/roles/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'role_delete',
        module: 'roles',
        http_method: 'DELETE',
        route: '/api/v1/admin/roles/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permission_list',
        module: 'permissions',
        http_method: 'GET',
        route: '/api/v1/admin/permissions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'company_list',
        module: 'companies',
        http_method: 'GET',
        route: '/api/v1/admin/companies',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'company_get',
        module: 'companies',
        http_method: 'GET',
        route: '/api/v1/admin/companies/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'company_create',
        module: 'companies',
        http_method: 'POST',
        route: '/api/v1/admin/companies',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'company_update',
        module: 'companies',
        http_method: 'PUT',
        route: '/api/v1/admin/companies/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'company_delete',
        module: 'companies',
        http_method: 'DELETE',
        route: '/api/v1/admin/companies/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'branch_list',
        module: 'branches',
        http_method: 'GET',
        route: '/api/v1/admin/branches',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'branch_get',
        module: 'branches',
        http_method: 'GET',
        route: '/api/v1/admin/branches/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'branch_create',
        module: 'branches',
        http_method: 'POST',
        route: '/api/v1/admin/branches',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'branch_update',
        module: 'branches',
        http_method: 'PUT',
        route: '/api/v1/admin/branches/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'branch_delete',
        module: 'branches',
        http_method: 'DELETE',
        route: '/api/v1/admin/branches/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_list',
        module: 'forms',
        http_method: 'GET',
        route: '/api/v1/admin/forms',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_get',
        module: 'forms',
        http_method: 'GET',
        route: '/api/v1/admin/forms/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_create',
        module: 'forms',
        http_method: 'POST',
        route: '/api/v1/admin/forms',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_update',
        module: 'forms',
        http_method: 'PUT',
        route: '/api/v1/admin/forms/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_delete',
        module: 'forms',
        http_method: 'DELETE',
        route: '/api/v1/admin/forms/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_section_list',
        module: 'form_sections',
        http_method: 'GET',
        route: '/api/v1/admin/form-sections',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_section_get',
        module: 'form_sections',
        http_method: 'GET',
        route: '/api/v1/admin/form-sections/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_section_create',
        module: 'form_sections',
        http_method: 'POST',
        route: '/api/v1/admin/form-sections',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_section_update',
        module: 'form_sections',
        http_method: 'PUT',
        route: '/api/v1/admin/form-sections/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_section_delete',
        module: 'form_sections',
        http_method: 'DELETE',
        route: '/api/v1/admin/form-sections/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_field_list',
        module: 'form_fields',
        http_method: 'GET',
        route: '/api/v1/admin/form-fields',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_field_get',
        module: 'form_fields',
        http_method: 'GET',
        route: '/api/v1/admin/form-fields/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_field_create',
        module: 'form_fields',
        http_method: 'POST',
        route: '/api/v1/admin/form-fields',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_field_update',
        module: 'form_fields',
        http_method: 'PUT',
        route: '/api/v1/admin/form-fields/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'form_field_delete',
        module: 'form_fields',
        http_method: 'DELETE',
        route: '/api/v1/admin/form-fields/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_menu_list',
        module: 'user_menu',
        http_method: 'GET',
        route: '/api/v1/admin/user-menus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_menu_get',
        module: 'user_menu',
        http_method: 'GET',
        route: '/api/v1/admin/user-menus/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_menu_create',
        module: 'user_menu',
        http_method: 'POST',
        route: '/api/v1/admin/user-menus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_menu_update',
        module: 'user_menu',
        http_method: 'PUT',
        route: '/api/v1/admin/user-menus/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user_menu_delete',
        module: 'user_menu',
        http_method: 'DELETE',
        route: '/api/v1/admin/user-menus/:id',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};