import { CommonModule } from "@angular/common";
import { Component, HostBinding, HostListener, inject } from "@angular/core";
import { PopoverDirective } from "../../shared/ng-is-components/popover.directive";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { MenuService } from "./menu.service";
import { Observable, combineLatest } from "rxjs";
import { TooltipDirective } from "../../shared/ng-is-components/tooltip.directive";
import { ApplicationStateService } from "../../app-state.service";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [
    CommonModule,
    PopoverDirective,
    RouterLink,
    TooltipDirective,
    RouterLinkActive,
  ],
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.scss",
})
export class MenuComponent {
  private readonly menuService: MenuService = inject(MenuService);
  private readonly appStateService: ApplicationStateService = inject(
    ApplicationStateService
  );

  showAccountPopover: boolean = false;
  menuList: any[] = [
    {
      label: "Administration",
      icon: "folder-gear",
      routerLink: "administration",
      children: [
        {
          label: "Users",
          icon: "users",
          routerLink: "/administration/users",
        },
        {
          label: "Roles",
          icon: "id-card-clip",
          routerLink: "/administration/roles",
        },
        {
          label: "Plans",
          icon: "wallet",
          routerLink: "/administration/plans",
        },
        {
          label: "IoT Devices",
          icon: "sensor",
          routerLink: "/administration/devices",
        },
        {
          label: "Device groups",
          icon: "layer-group",
          routerLink: "/administration/devicegroups",
        },
      ],
    },
    {
      label: "Global Map",
      icon: "map-location",
      routerLink: "map",
    },
    {
      label: "Pricing",
      icon: "wallet",
      routerLink: "pricing",
    },
  ];
  resizingEvent = {
    // whether the user is currently resizing the menu
    isResizing: false,
    // the x coordinate of the mouse when the user started resizing
    startingCursorX: 0,
    // the width of the menu when the user started resizing
    startingWidth: 0,
  };

  vm$?: Observable<any>;

  @HostBinding("class.resizing")
  get isResizing(): boolean {
    return this.resizingEvent.isResizing;
  }

  @HostListener("window:mousemove", ["$event"])
  updatemenuWidth(event: MouseEvent) {
    if (!this.resizingEvent.isResizing) {
      return;
    }

    const cursorDeltaX = event.clientX - this.resizingEvent.startingCursorX;

    const newWidth = this.resizingEvent.startingWidth + cursorDeltaX;

    this.menuService.setMenuWidth(newWidth);
  }

  @HostListener("window:mouseup")
  stopResizing() {
    this.resizingEvent.isResizing = false;
  }

  ngOnInit(): void {
    this.vm$ = combineLatest({
      menuCollapsed: this.menuService.isMenuCollapsed,
      user: this.appStateService.user,
    });
  }

  startResizing(event: MouseEvent): void {
    this.resizingEvent = {
      isResizing: true,
      startingCursorX: event.clientX,
      startingWidth: this.menuService.menuWidth,
    };
  }

  onSignOut(): void {
    this.appStateService.signOut();
  }
}
