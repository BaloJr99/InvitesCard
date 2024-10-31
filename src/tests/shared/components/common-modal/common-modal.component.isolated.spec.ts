import { CommonModalType } from 'src/app/core/models/enum';
import { CommonModalComponent } from 'src/app/shared/components/common-modal/common-modal.component';

describe('Common Modal Component (Isolated Test)', () => {
  let component: CommonModalComponent;
  const commonModalServiceSpy = jasmine.createSpyObj('CommonModalService', [
    '',
  ]);

  beforeEach(() => {
    component = new CommonModalComponent(commonModalServiceSpy);
  });

  it('should create', () => {
    expect(component)
      .withContext('CommonModalComponent is not being created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.actionButton1)
      .withContext('Action button 1 should be empty')
      .toEqual('');

    expect(component.actionButton2)
      .withContext('Action button 2 should be empty')
      .toEqual('');

    expect(component.commonModalData)
      .withContext('Common Modal Data should be empty')
      .toEqual({
        modalTitle: '',
        modalBody: '',
        modalType: CommonModalType.None,
      });
  });
});
