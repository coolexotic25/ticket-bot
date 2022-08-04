const Command = require("../../structures/Command");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");

module.exports = class PayPal extends Command {
  constructor(client) {
    super(client, {
      name: "paypal",
      description: client.cmdConfig.paypal.description,
      usage: client.cmdConfig.paypal.usage,
      permissions: client.cmdConfig.paypal.permissions,
      aliases: client.cmdConfig.paypal.aliases,
      category: "service",
      listed: client.cmdConfig.paypal.enabled,
      slash: true,
      options: [{
        name: 'user',
        type: ApplicationCommandOptionType.User,
        description: "User to create link for",
        required: true,
      },{
        name: 'mail',
        type: ApplicationCommandOptionType.String,
        description: "Mail to send Money to",
        required: true,
      },{
        name: 'amount',
        type: ApplicationCommandOptionType.Number,
        description: "Amount of Money to send",
        required: true,
      },{
        name: 'service',
        type: ApplicationCommandOptionType.String,
        description: "Service User's paying for",
        required: true,
      }]
    });
  }

  async run(message, args) {
    let config = this.client.config;

    let user = message.mentions.users.first();
    let mail = args[1];
    let amount = args[2];
    let service = args.slice(3).join(" ");
    
    if(!user) return message.channel.send({ embeds: [this.client.utils.usage(this.client, message, this.client.cmdConfig.paypal.usage)] }); 
    if(!mail || !mail.includes("@")) return message.channel.send({ embeds: [this.client.utils.usage(this.client, message, this.client.cmdConfig.paypal.usage)] }); 
    if(!amount || isNaN(amount)) return message.channel.send({ embeds: [this.client.utils.usage(this.client, message, this.client.cmdConfig.paypal.usage)] }); 
    if(!service) return message.channel.send({ embeds: [this.client.utils.usage(this.client, message, this.client.cmdConfig.paypal.usage)] }); 
    
    let product = encodeURIComponent(service.trim()); 
    
    let link = `https://www.paypal.com/cgi-bin/webscr?&cmd=_xclick&business=${mail}&currency_code=${config.general.currency}&amount=${amount}&item_name=${product}&no_shipping=1`;
    
    let embed = new EmbedBuilder()
      .setColor(this.client.embeds.service.paypal.color);
    if(this.client.embeds.service.paypal.title) embed.setTitle(this.client.embeds.service.paypal.title);
    
    if(this.client.embeds.service.paypal.description) embed.setDescription(this.client.embeds.service.paypal.description.replace("<amount>", amount)
      .replace("<seller>", message.author)
      .replace("<user>", user)
      .replace("<currency>", this.client.config.general.currency)
      .replace("<currencySymbol>", this.client.config.general.currency_symbol)
      .replace("<service>", service));
    
    let field = this.client.embeds.service.paypal.fields;
    for(let i = 0; i < this.client.embeds.service.paypal.fields.length; i++) {
      embed.addFields([{ name: field[i].title.replace("<currency>", this.client.config.general.currency), value: field[i].description.replace("<amount>", amount)
        .replace("<seller>", message.author)
        .replace("<user>", user)
        .replace("<currency>", this.client.config.general.currency)
        .replace("<currencySymbol>", this.client.config.general.currency_symbol)
        .replace("<service>", service), inline: true }])
    }
    
    if(this.client.embeds.service.paypal.footer == true ) embed.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() }).setTimestamp();
    if(this.client.embeds.service.paypal.thumbnail == true) embed.setThumbnail(message.author.displayAvatarURL());
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setURL(link)
        .setLabel(this.client.language.buttons.paypal)
        .setStyle(ButtonStyle.Danger),
      );
      
    message.channel.send({ embeds: [embed], components: [row] });
  }
  async slashRun(interaction, args) {
    let config = this.client.config;

    let user = interaction.options.getUser("user");
    let mail = interaction.options.getString("mail");
    let amount = interaction.options.getNumber("amount");
    let service = interaction.options.getString("service");
    
    if(!mail.includes("@")) return interaction.reply({ embeds: [this.client.utils.usage(this.client, interaction, this.client.cmdConfig.paypal.usage)] }); 
    if(isNaN(amount)) return interaction.reply({ embeds: [this.client.utils.usage(this.client, interaction, this.client.cmdConfig.paypal.usage)] }); 

    let product = encodeURIComponent(service.trim()); 
    
    let link = `https://www.paypal.com/cgi-bin/webscr?&cmd=_xclick&business=${mail}&currency_code=${config.general.currency}&amount=${amount}&item_name=${product}&no_shipping=1`;
    
    let embed = new EmbedBuilder()
      .setColor(this.client.embeds.service.paypal.color);
    if(this.client.embeds.service.paypal.title) embed.setTitle(this.client.embeds.service.paypal.title);
    
    if(this.client.embeds.service.paypal.description) embed.setDescription(this.client.embeds.service.paypal.description.replace("<amount>", amount)
      .replace("<seller>", interaction.user)
      .replace("<user>", user)
      .replace("<currency>", this.client.config.general.currency)
      .replace("<currencySymbol>", this.client.config.general.currency_symbol)
      .replace("<service>", service));
    
    let field = this.client.embeds.service.paypal.fields;
    for(let i = 0; i < this.client.embeds.service.paypal.fields.length; i++) {
      embed.addFields([{ name: field[i].title.replace("<currency>", this.client.config.general.currency), value: field[i].description.replace("<amount>", amount)
        .replace("<seller>", interaction.user)
        .replace("<user>", user)
        .replace("<currency>", this.client.config.general.currency)
        .replace("<currencySymbol>", this.client.config.general.currency_symbol)
        .replace("<service>", service), inline: true }])
    }
    
    if(this.client.embeds.service.paypal.footer == true ) embed.setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() }).setTimestamp();
    if(this.client.embeds.service.paypal.thumbnail == true) embed.setThumbnail(interaction.user.displayAvatarURL());
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setURL(link)
        .setLabel(this.client.language.buttons.paypal)
        .setStyle(ButtonStyle.Danger),
      );
      
    interaction.reply({ embeds: [embed], components: [row] });
  }
};
