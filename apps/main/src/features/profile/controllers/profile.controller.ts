import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth';
import { FillOutProfileCommand } from '../application/use-cases/fill-out-profile.handler';
import { GetUserContextDecorator } from '../../auth/decorators/get-user-context.decorator';
import { JwtAtPayload } from '../../auth/types/jwt.type';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post('/fill-out')
    @UseGuards(JwtAuthGuard)
    async fillOutProfile(
        @Body() body: FillOutProfileCommand,
        @GetUserContextDecorator() ctx: JwtAtPayload
    ) {
        return this.commandBus.execute<FillOutProfileCommand>(
            new FillOutProfileCommand(
                body.userName, body.firstName, body.lastName, body.birthDate,
                body.city, body.aboutMe, ctx.user.id, ctx.user.name
            )
        )
    }
}
