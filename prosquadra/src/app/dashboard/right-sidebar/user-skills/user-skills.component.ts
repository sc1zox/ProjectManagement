import {Component, inject, Input, OnChanges, signal, SimpleChanges} from '@angular/core';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {SkillService} from '../../../../services/skill.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {User} from '../../../../types/user';
import {Skill} from '../../../../types/skill';
import {SnackbarService} from '../../../../services/snackbar.service';
import {fadeIn} from '../../../../animations/fadeIn';

@Component({
  selector: 'app-user-skills',
  standalone: true,
  imports: [
    MatChipGrid,
    MatChipInput,
    MatChipRemove,
    MatChipRow,
    MatFormField,
    MatIcon,
    MatLabel,
    NgForOf,
    MatHint,
  ],
  animations: [
    fadeIn
  ],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.scss'
})
export class UserSkillsComponent implements OnChanges {
  @Input() user?: User;
  skills: Skill[] = [];
  readonly result = signal<string[]>([]);
  readonly announcer = inject(LiveAnnouncer);
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // Source https://material.angular.io/components/chips/examples

  constructor(private readonly SkillService: SkillService,private readonly SnackBarService: SnackbarService) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      try {
        this.skills = await this.SkillService.getSkill(this.user.id);
        this.result.set(this.skills.map(skill => skill.name));
      }catch (error){
        this.SnackBarService.open('Error beim Laden der Skills')
      }
    }
  }

  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (this.user && value) {
      try {
        this.SkillService.addSkill(value, this.user.id).then(updatedSkills => {
          this.skills = updatedSkills;
          this.result.set(this.skills.map(skill => skill.name));
        });
      }catch (error){
        this.SnackBarService.open('Error beim hinzufügen der Skills');
      }
      }
    event.chipInput!.clear();
  }

  remove(skillName: string): void {
    if (this.user) {
      try {
        this.SkillService.removeSkill(skillName, this.user.id).then(updatedSkills => {
          this.skills = updatedSkills;
          this.result.set(this.skills.map(skill => skill.name));
          this.announcer.announce(`Removed ${skillName}`);
        });
      }catch (error){
        this.SnackBarService.open('Fehler bei der Skillentfernung')
      }
    }
  }
}
