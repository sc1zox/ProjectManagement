import {Component, inject, Input, OnChanges, signal, SimpleChanges} from '@angular/core';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {SkillService} from '../../../../services/skill.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {User} from '../../../../types/user';
import {Skill} from '../../../../types/skill';

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
    NgForOf
  ],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.scss'
})
export class UserSkillsComponent implements OnChanges {
  @Input() user?: User;
  skills: Skill[] = [];
  readonly result = signal<string[]>(['test']);
  readonly announcer = inject(LiveAnnouncer);
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // Source https://material.angular.io/components/chips/examples

  constructor(private readonly SkillService: SkillService) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.skills = await this.SkillService.getSkill(this.user.id);
      this.result.set(this.skills.map(skill => skill.name));
    }
  }

  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (this.user && value) {
      this.SkillService.addSkill(value, this.user.id).then(updatedSkills => {
        this.skills = updatedSkills;
        this.result.set(this.skills.map(skill => skill.name));
      });
    }
    event.chipInput!.clear();
  }

  remove(skillName: string): void {
    if (this.user) {
      this.SkillService.removeSkill(skillName, this.user.id).then(updatedSkills => {
        this.skills = updatedSkills;
        this.result.set(this.skills.map(skill => skill.name));
        this.announcer.announce(`Removed ${skillName}`);
      });
    }
  }
}
