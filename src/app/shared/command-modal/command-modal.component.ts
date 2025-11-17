import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-command-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './command-modal.component.html',
  styleUrls: ['./command-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandModalComponent {
  @ViewChild('dialog', { static: true })
  private readonly dialog?: ElementRef<HTMLDialogElement>;

  openDialog(): void {
    this.dialog?.nativeElement.showModal();
  }

  closeDialog(): void {
    this.dialog?.nativeElement.close();
  }

  execute(): void {
    this.closeDialog();
  }
}
