import {User, UserRole} from '../types/user';

export function canEditStatus(user: User): boolean {
  switch (user?.role) {
    case UserRole.Admin:
    case UserRole.PO:
    case UserRole.Bereichsleiter:
      return true;
    default:
      return false;
  }
}

export function canEditInDashboard(user: User): boolean {
  switch (user?.role) {
    case UserRole.Bereichsleiter:
      return true;
    default:
      return false;
  }
}

export function canEditDate(user: User): boolean {
  switch (user?.role) {
    case UserRole.Admin:
    case UserRole.SM:
    case UserRole.Bereichsleiter:
      return true;
    default:
      return false;
  }
}
