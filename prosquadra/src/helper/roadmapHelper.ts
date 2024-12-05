import {ProjectStatus} from '../types/project';

export function getStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.offen:
      return 'Offen';
    case ProjectStatus.inBearbeitung:
      return 'In Bearbeitung';
    case ProjectStatus.geschlossen:
      return 'Geschlossen';
    default:
      return status;
  }
}
