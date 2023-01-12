import EmbedWrapper from './EmbedWrapper.js';
import colors from '../util/colors.js';
import {AttachmentBuilder, escapeMarkdown} from 'discord.js';
import {EMBED_DESCRIPTION_LIMIT} from '../util/apiLimits.js';

export default class MessageDeleteEmbed extends EmbedWrapper {
    #files = [];

    constructor(message) {
        super();
        this.setColor(colors.RED);
        if (message.system) {
            this.setAuthor({
                name: `A system message was deleted in #${message.channel.name}`
            });
        }
        else {
            this.setAuthor({
                name: `Message by ${escapeMarkdown(message.author.tag)} was deleted in #${message.channel.name}`,
                iconURL: message.author.avatarURL()
            }).setFooter({text:
                    `Message ID: ${message.id}\n` +
                    `Channel ID: ${message.channel.id}\n` +
                    `User ID: ${message.author.id}`
            });

            if (message.content.length) {
                this.setDescription(message.content.substring(0, EMBED_DESCRIPTION_LIMIT));
            }
        }

        for (const attachment of message.attachments.values()) {
            this.#files.push(new AttachmentBuilder(attachment.attachment)
                .setDescription(attachment.description)
                .setName(attachment.name)
                .setSpoiler(true));
        }
    }

    toMessage(ephemeral = true) {
        const message = super.toMessage(ephemeral);
        message.files = this.#files;
        return message;
    }
}