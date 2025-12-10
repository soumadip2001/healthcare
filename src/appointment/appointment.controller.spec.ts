import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            getListofAllDoctors: jest.fn(), // mock function
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of doctors', async () => {
      const mockDoctors = [
        { _id: '1', name: 'Dr. A' },
        { _id: '2', name: 'Dr. B' },
      ];

      // Mock the service method
      jest
        .spyOn(service, 'getListofAllDoctors')
        .mockResolvedValue(mockDoctors);

      const result = await controller.findAll();
      expect(result).toEqual(mockDoctors);
      expect(service.getListofAllDoctors).toHaveBeenCalled();
    });
  });
});
