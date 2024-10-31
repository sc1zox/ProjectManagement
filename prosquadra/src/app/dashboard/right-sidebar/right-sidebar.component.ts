import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatChipEditedEvent, MatChipGrid, MatChipInput, MatChipInputEvent, MatChipsModule, MatChipRow} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {NgForOf} from '@angular/common';
import {MatBadge} from '@angular/material/badge';

export interface ProgrammingLanguage{
  name: string
}

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
  imports: [
    MatLabel,
    MatChipRow,
    MatChipGrid,
    MatFormField,
    MatIcon,
    MatChipInput,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatAccordion,
    NgForOf,
    MatBadge,
    MatExpansionPanelHeader,
    MatChipsModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RightSidebarComponent {

  public userProjects: string[] = ["Project A","Project A","Project A","Project A","Project A","Project A","Project A","Project A",]
  public notifications: number = 15;

  // Source https://material.angular.io/components/chips/examples

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly result = signal<ProgrammingLanguage[]>([{name: 'HTML'}, {name: 'CSS'}, {name: 'JAVASCRIPT'}]);
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.result.update(pls => [...pls, {name: value}]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(pl: ProgrammingLanguage): void {
    this.result.update(pls => {
      const index = pls.indexOf(pl);
      if (index < 0) {
        return pls;
      }

      pls.splice(index, 1);
      this.announcer.announce(`Removed ${pl.name}`);
      return [...pls];
    });
  }

  edit(pl: ProgrammingLanguage, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(pl);
      return;
    }

    // Edit existing fruit
    this.result.update(pls => {
      const index = pls.indexOf(pl);
      if (index >= 0) {
        pls[index].name = value;
        return [...pls];
      }
      return pls;
    });
  }
}
