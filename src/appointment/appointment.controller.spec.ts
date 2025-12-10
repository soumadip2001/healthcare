import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointment.controller';
import { AppointmentService, Doctor } from './appointment.service';

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
            getListofAllDoctors: jest.fn().mockResolvedValue([
              { _id: '1', name: 'Dr. A' },
              { _id: '2', name: 'Dr. B' },
            ] as Doctor[]),
          },
        },
      ],
    }).compile();

    controller = module.get(AppointmentController);
    service = module.get(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of doctors', async () => {
      const mockDoctors: Doctor[] = [
        { _id: '1', name: 'Dr. A' },
        { _id: '2', name: 'Dr. B' },
      ];

      // Use bind() to prevent unbound-method error
      jest.spyOn(service, 'getListofAllDoctors').mockResolvedValue(mockDoctors);

      const result = await controller.findAll();
      expect(result).toEqual(mockDoctors);
      // expect(service.getListofAllDoctors).toHaveBeenCalledTimes(1);
    });
  });
});
