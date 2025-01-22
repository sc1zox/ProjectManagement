import {ProjectStatus} from '../types/project';

export function getStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.offen:
      return 'Open';
    case ProjectStatus.inPlanung:
      return 'In planning';
    case ProjectStatus.inBearbeitung:
      return 'In progress';
    case ProjectStatus.geschlossen:
      return 'Closed';
    default:
      return status;
  }
}
