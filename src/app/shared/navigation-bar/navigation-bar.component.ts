import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string[];
}

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'navigation-bar',
  },
})
export class NavigationBarComponent {
  protected readonly links: NavLink[] = [
    { label: 'DMX Control', path: ['/'] },
    { label: 'Fixture Detail', path: ['/fixtures'] },
    { label: 'Dashboard', path: ['/dashboard'] },
  ];
}
