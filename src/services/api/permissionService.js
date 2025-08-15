class PermissionService {
  // Define role hierarchy and permissions
  rolePermissions = {
    'saas_admin': {
      events: ['view', 'create', 'edit', 'delete'],
      accounts: ['view', 'create', 'edit', 'delete'],
      budgets: ['view', 'create', 'edit', 'delete'],
      reservations: ['view', 'create', 'edit', 'delete'],
      inventory: ['view', 'create', 'edit', 'delete'],
      users: ['view', 'create', 'edit', 'delete'],
      reports: ['view', 'export']
    },
    'owner': {
      events: ['view', 'create', 'edit', 'delete'],
      accounts: ['view', 'create', 'edit', 'delete'],
      budgets: ['view', 'create', 'edit', 'delete'],
      reservations: ['view', 'create', 'edit', 'delete'],
      inventory: ['view', 'create', 'edit', 'delete'],
      users: ['view'],
      reports: ['view', 'export']
    },
    'entrepreneur': {
      events: ['view'],
      accounts: ['view'],
      budgets: ['view'],
      reservations: ['view', 'create', 'edit'],
      inventory: ['view'],
      users: [],
      reports: ['view']
    }
  };

  checkPermission(user, permission, resourceId = null) {
    if (!user || !user.role) return false;

    const [resource, action] = permission.split('.');
    const userPermissions = this.rolePermissions[user.role];

    if (!userPermissions || !userPermissions[resource]) return false;

    // Check if user has the required action permission
    const hasActionPermission = userPermissions[resource].includes(action);
    if (!hasActionPermission) return false;

    // For non-admin roles, check resource-specific access
    if (user.role !== 'saas_admin' && resourceId) {
      return this.hasResourceAccess(user, resource, resourceId);
    }

    return true;
  }

  hasResourceAccess(user, resource, resourceId) {
    if (user.role === 'saas_admin') return true;

    switch (resource) {
      case 'events':
        return this.canAccessEvent(user, resourceId);
      case 'accounts':
        return this.canAccessAccount(user, resourceId);
      case 'budgets':
        return this.canAccessBudget(user, resourceId);
      case 'reservations':
return this.canAccessReservation(user, resourceId);
      case 'inventory':
        return this.canAccessInventory(user, resourceId);
      default:
        return false;
    }
  }

  canAccessEvent(user, eventId) {
    if (user.role === 'saas_admin') return true;
    
    if (user.role === 'owner') {
      // Owners have access to all events (for simplicity)
      // In a real system, this would check event ownership
      return true;
    }

    if (user.role === 'entrepreneur') {
      return user.assignedEventIds && user.assignedEventIds.includes(parseInt(eventId));
    }

    return false;
  }

  canAccessAccount(user, accountId) {
    if (user.role === 'saas_admin') return true;
    
    // For now, owners can access all accounts
    // Entrepreneurs can only view accounts related to their events
    return user.role === 'owner';
  }

  canAccessBudget(user, budgetId) {
    if (user.role === 'saas_admin') return true;
    return user.role === 'owner';
  }

  canAccessReservation(user, reservationId) {
    if (user.role === 'saas_admin') return true;
    if (user.role === 'owner') return true;
    
    // Entrepreneurs can access reservations for their assigned events
    return user.role === 'entrepreneur';
  }

  canAccessInventory(user, inventoryId) {
    if (user.role === 'saas_admin') return true;
    return user.role === 'owner';
  }

  filterEventsByAccess(user, events) {
    if (!user) return [];
    
    if (user.role === 'saas_admin' || user.role === 'owner') {
      return events;
    }

    if (user.role === 'entrepreneur') {
      return events.filter(event => 
        user.assignedEventIds && user.assignedEventIds.includes(event.Id)
      );
    }

    return [];
  }

  filterAccountsByAccess(user, accounts) {
    if (!user) return [];
    
    if (user.role === 'saas_admin' || user.role === 'owner') {
      return accounts;
    }

    // Entrepreneurs can only view accounts, not modify
    if (user.role === 'entrepreneur') {
      return accounts.filter(account => 
        !account.eventId || 
        (user.assignedEventIds && user.assignedEventIds.includes(account.eventId))
      );
    }

    return [];
  }

  getMenuItemsForRole(user) {
    if (!user) return [];

    const allMenuItems = [
      { to: "/", icon: "LayoutDashboard", label: "Dashboard", permission: "events.view" },
      { to: "/events", icon: "Calendar", label: "Eventos", badge: "3", permission: "events.view" },
      { to: "/budgets", icon: "Calculator", label: "Presupuestos", permission: "budgets.view" },
      { to: "/vip-reservations", icon: "Crown", label: "Reservas VIP", permission: "reservations.view" },
      { to: "/bar-inventory", icon: "Package", label: "Bar e Inventario", permission: "inventory.view" },
      { to: "/financial-accounts", icon: "Wallet", label: "Cuentas Financieras", permission: "accounts.view" }
    ];

    return allMenuItems.filter(item => 
      this.checkPermission(user, item.permission)
    );
  }
}

const permissionService = new PermissionService();

export { permissionService };
export default PermissionService;