import { NotAuthorizedComponent } from 'src/app/shared/components/not-authorized/not-authorized.component';

describe('Not Authorized Component (Isolated Test)', () => {
  let component: NotAuthorizedComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['']);
  const tokenStorageServiceSpy = jasmine.createSpyObj('TokenStorageService', [
    '',
  ]);

  beforeEach(() => {
    component = new NotAuthorizedComponent(routerSpy, tokenStorageServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
